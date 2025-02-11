def chainlit_log(content):
    f = open("logs.txt", "a")
    f.write(f"chainlit - {content} \n\n")
    f.close()

def ticket_generator_log(content):
    f = open("logs.txt", "a")
    f.write(f"ticket generator - {content}\n\n")
    f.close()

def hubspot_log(content):
    f = open("logs.txt", "a")
    f.write(f"hubspot connect - {content}\n\n")
    f.close()